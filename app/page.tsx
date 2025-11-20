'use client'; 

import { useState } from 'react';
import { ResumeResponseContent } from './lib/ai-response';
import Upload from './pages/upload/index';
import Results from './pages/results';

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<null | ResumeResponseContent>(null);

  return (
    <> 
      {
        !analysisResult ? <Upload setAnalysisResult={setAnalysisResult}/> : <Results analysisResult={analysisResult}/>
      }
    </>
  );
}