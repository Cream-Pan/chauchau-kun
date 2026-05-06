"use client";

import { useState, useRef } from "react";
import { PERSONAS, PersonaId } from "@/constants/personas";
import { Upload, Send, Leaf, MessageSquare, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [personaId, setPersonaId] = useState<PersonaId>("i_sensei");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ファイル選択ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    setErrorMessage("");
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    const MAX_FILE_SIZE_MB = 6;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      const actualSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`ファイルサイズが大きすぎます。${MAX_FILE_SIZE_MB}MB以下のPDFを選択してください。（現在: ${actualSize}MB）`);
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const sendMessage = async () => {
    if (!file || isLoading) return;

    if (!input.trim() && messages.length > 0) return;

    const userMsg = input.trim() || "この資料を読んで、あなたの視点で質問をしてください。";
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("personaId", personaId);
    formData.append("message", userMsg);
    formData.append("history", JSON.stringify(messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }))));

    try {
      const res = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.text }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "エラーが発生しました。接続を確認してください。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fdf8] text-slate-800 font-sans">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden z-0">
        <Leaf className="absolute -top-10 -left-10 w-64 h-64 rotate-45" />
        <Leaf className="absolute bottom-20 -right-20 w-80 h-80 -rotate-12" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-emerald-900 mb-2 flex items-center justify-center gap-3">
            <img 
              src="/icon.png"
              alt="Logo"
              className="w-25 h-25 object-contain"
            />
            ちゃうちゃう君
          </h1>
          <p className="text-emerald-700">ちゃうちゃう君へようこそ。資料を提出して、チェックを受けましょう。</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左サイド：設定パネル */}
          <div className="md:col-span-1 space-y-6">
            <section className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h2 className="font-bold mb-4 flex items-center gap-2"><Upload className="w-4 h-4" /> 資料アップロード</h2>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="text-sm block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              {errorMessage ? (
                <p className="mt-2 text-xs text-red-500 font-medium">{errorMessage}</p>
              ) : file ? (
                <p className="mt-2 text-xs text-emerald-600 font-medium">選択中: {file.name}</p>
              ) : (
                <p className="mt-2 text-xs text-slate-400">6MB以下のPDFを選択してください</p>
              )}
            </section>

            <section className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h2 className="font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> 教授を選択</h2>
              <div className="space-y-3">
                {Object.values(PERSONAS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersonaId(p.id as PersonaId)}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all ${personaId === p.id ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200" : "bg-white hover:bg-emerald-50 border border-emerald-100"}`}
                  >
                    <div className="font-bold">{p.name}</div>
                    <div className={`text-xs ${personaId === p.id ? "text-emerald-100" : "text-slate-500"}`}>{p.role}</div>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* 右サイド：チャット画面 */}
          <div className="md:col-span-2 flex flex-col h-150 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-sm">
                  <Leaf className="w-12 h-12 mb-4 opacity-20" />
                  PDFをアップロードして、セッションを開始してください。
                </div>
              )}
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === "user" ? "bg-emerald-700 text-white rounded-tr-none" : "bg-white text-slate-800 border border-emerald-50 rounded-tl-none"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-50 animate-pulse text-xs text-emerald-600">教授が資料を読んでいます...</div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white/80 border-t border-emerald-100 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={file ? "回答を入力... (Shift+Enterで改行)" : "まずPDFを選択してください"}
                disabled={!file || isLoading}
                rows={1}
                className="flex-1 bg-emerald-50/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none min-h-11 max-h-32 overflow-y-auto"
              />
              <button
                type="submit"
                disabled={!file || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors mb-0.5"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}