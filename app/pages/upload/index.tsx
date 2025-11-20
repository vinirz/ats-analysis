'use client'; 

import { useState, useRef, type DragEvent, type ChangeEvent, type FormEvent } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { ResumeResponseContent } from '@/app/lib/ai-response';
import { findEmptyFields } from '@/app/lib/find-empty-fields';

const PERMITTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export default function Upload({ setAnalysisResult }: { setAnalysisResult: (result: ResumeResponseContent) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!PERMITTED_FILE_TYPES.includes(selectedFile.type)) {
      setError('Tipo de arquivo inválido. Por favor, envie PDF, DOCX ou TXT.');
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. O limite é de 5MB.');
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo para analisar.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Falha ao enviar o currículo.');
      }

      const result = await response.json();
      
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Analisador de Currículo ATS
          </h1>
          <p className="mt-2 text-md text-gray-600">
            Envie seu currículo e veja como a Inteligência Artificial
            avalia seu perfil para o mercado de trabalho.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`
              relative flex flex-col items-center justify-center w-full p-12 
              border-2 border-dashed rounded-lg cursor-pointer
              transition-colors duration-200 ease-in-out
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
              ${error ? 'border-red-500 bg-red-50' : ''}
            `}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={PERMITTED_FILE_TYPES.join(',')}
            />

            {!file && (
              <div className="text-center">
                <UploadCloud 
                  className={`w-12 h-12 mx-auto mb-4 
                  ${isDragging ? 'text-blue-600' : 'text-gray-400'}
                  ${error ? 'text-red-600' : ''}`} 
                />
                <p className="font-semibold text-gray-700">
                  Arraste e solte seu currículo aqui
                </p>
                <p className="text-sm text-gray-500">ou clique para selecionar</p>
                <p className="mt-3 text-xs text-gray-400">
                  Formatos permitidos: PDF, DOCX, TXT (Max 5MB)
                </p>
              </div>
            )}

            {file && (
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <p className="font-semibold text-gray-700">
                  Arquivo selecionado:
                </p>
                <p className="text-sm text-gray-600 break-all">{file.name}</p>
                
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remover arquivo"
                  disabled={isLoading}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!file || isLoading}
            className={`
              w-full flex items-center justify-center px-6 py-4 
              font-semibold text-lg text-white rounded-lg 
              transition-all duration-200 ease-in-out
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              disabled:bg-gray-400 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analisando...
              </>
            ) : (
              'Analisar Currículo'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}