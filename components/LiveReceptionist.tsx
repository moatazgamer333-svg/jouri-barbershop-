import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Button } from './ui';
import { getApiKey } from '../services/geminiService';

interface LiveReceptionistProps {
  onClose: () => void;
}

export const LiveReceptionist: React.FC<LiveReceptionistProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Audio Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null); 
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const disconnect = () => {
    inputSourceRef.current?.disconnect();
    scriptProcessorRef.current?.disconnect();
    
    sourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e){}
    });
    sourcesRef.current.clear();

    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
  };

  const connect = async () => {
    setStatus('connecting');
    setErrorMsg('');
    
    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      
      // Setup Audio
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const inputCtx = inputAudioContextRef.current;
      const outputCtx = outputAudioContextRef.current;

      outputNodeRef.current = outputCtx.createGain();
      outputNodeRef.current.connect(outputCtx.destination);

      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            console.log("Live Session Open");
            
            // Start Recording
            const source = inputCtx.createMediaStreamSource(stream);
            inputSourceRef.current = source;
            
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              }
            };
            
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             // Handle Output Audio
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
                 setStatus('speaking');
                 if (outputCtx.state === 'suspended') await outputCtx.resume();
                 
                 nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                 
                 const audioBuffer = await decodeAudioData(
                     decode(base64Audio),
                     outputCtx,
                     24000,
                     1
                 );
                 
                 const source = outputCtx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(outputNodeRef.current!);
                 
                 source.addEventListener('ended', () => {
                    sourcesRef.current.delete(source);
                    // Simple heuristic: if no sources playing, we are listening again
                    if (sourcesRef.current.size === 0) setStatus('listening');
                 });
                 
                 source.start(nextStartTimeRef.current);
                 nextStartTimeRef.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
             }

             const interrupted = message.serverContent?.interrupted;
             if (interrupted) {
                 sourcesRef.current.forEach(s => s.stop());
                 sourcesRef.current.clear();
                 nextStartTimeRef.current = 0;
                 setStatus('listening');
             }
          },
          onclose: () => {
             console.log("Session Closed");
             if (status !== 'error') setStatus('idle');
          },
          onerror: (e: any) => {
              console.error("Session Error", e);
              // Do NOT ask for key, just show generic error
              setStatus('error');
              if (e.message?.includes('403') || e.message?.includes('429')) {
                  setErrorMsg("Reception is currently very busy.");
              } else {
                  setErrorMsg("Connection unavailable.");
              }
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            systemInstruction: `You are Aisha, the warm, professional, and charming receptionist at Jouri Barbershop in Marrakech. 
            Speak with a slight welcoming tone. 
            Your role is to welcome guests, explain that Jouri offers premium grooming services (Haircuts 150-250 MAD), and encourage them to use the screen to book an appointment.
            Keep answers short and conversational.`,
        }
      };

      sessionPromiseRef.current = ai.live.connect(config);
      await sessionPromiseRef.current;

    } catch (e: any) {
        console.error(e);
        setStatus('error');
        setErrorMsg("Unable to reach the studio.");
    }
  };

  // --- Audio Helpers ---
  function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return {
        data: btoa(binary),
        mimeType: 'audio/pcm;rate=16000'
    };
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let channel = 0; channel < numChannels; channel++) {
          const channelData = buffer.getChannelData(channel);
          for (let i = 0; i < frameCount; i++) {
              channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
          }
      }
      return buffer;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 border border-morocco-gold/50 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* Visualizer */}
        <div className="w-32 h-32 rounded-full bg-black border-2 border-morocco-gold/30 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(212,175,55,0.3)]">
           <div className={`absolute inset-0 rounded-full bg-morocco-gold blur-xl opacity-20 ${status === 'speaking' ? 'animate-pulse' : ''}`}></div>
           
           {status === 'speaking' && (
             <div className="flex gap-1 h-12 items-center">
               <div className="w-1 bg-morocco-gold animate-[float_1s_ease-in-out_infinite] h-8"></div>
               <div className="w-1 bg-morocco-gold animate-[float_1.2s_ease-in-out_infinite] h-12"></div>
               <div className="w-1 bg-morocco-gold animate-[float_0.8s_ease-in-out_infinite] h-6"></div>
               <div className="w-1 bg-morocco-gold animate-[float_1.5s_ease-in-out_infinite] h-10"></div>
               <div className="w-1 bg-morocco-gold animate-[float_1.1s_ease-in-out_infinite] h-7"></div>
             </div>
           )}
           {status === 'listening' && (
             <div className="w-3 h-3 bg-morocco-red rounded-full animate-ping"></div>
           )}
           {status === 'connecting' && (
             <svg className="animate-spin h-8 w-8 text-morocco-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           )}
           {status === 'error' && (
             <svg className="w-10 h-10 text-morocco-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
           )}
        </div>

        <h2 className="text-2xl font-serif text-white mb-2">Receptionist Aisha</h2>
        <p className="text-gray-400 text-sm mb-6 text-center min-h-[20px]">
           {status === 'connecting' && "Connecting to studio..."}
           {status === 'listening' && "Listening... (Go ahead, speak)"}
           {status === 'speaking' && "Speaking..."}
           {status === 'error' && errorMsg}
           {status === 'idle' && "Call Ended"}
        </p>

        {status === 'error' ? (
           <Button onClick={connect} className="w-full bg-white text-morocco-dark hover:bg-gray-200 border-none">
              Retry Connection
           </Button>
        ) : (
           <Button onClick={onClose} variant="outline" className="border-gray-600 text-gray-300 hover:border-white hover:text-white w-full">
              End Call
           </Button>
        )}
      </div>
    </div>
  );
};