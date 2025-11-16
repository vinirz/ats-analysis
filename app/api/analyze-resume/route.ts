import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ResumeSchema } from "@/app/lib/ai-response";

const { GEMINI_API_KEY } = process.env;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const PERMITTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

type ApiError = {
  tag: string,
  message: string
}

function checkRequest(file: Blob){
  let error: ApiError | null = null

  if(!file) {
    error = {
      tag: 'FILE_NOT_FOUND',
      message: 'Nenhum arquivo enviado'
    }
  }

  if(file.size > 20 * 1024 * 1024) {
    error = {
      tag: 'FILE_TOO_LARGE',
      message: 'O arquivo enviado excede o limite de 20MB'
    }
  }

  if(!PERMITTED_FILE_TYPES.includes(file.type)) {
    error = {
      tag: 'FILE_TYPE_NOT_SUPPORTED',
      message: 'O tipo de arquivo enviado não é suportado'
    }
  }

  return error
}

export async function POST(request: NextRequest) {
  const bodyFile = await request.formData();
  const file = bodyFile.get('resume') as Blob;

  const error = checkRequest(file);

  if(error) {
    return NextResponse.json({
      error
    }, {
      status: 400
    });
  }

  const fileBuffer = await file.arrayBuffer()

  const contents = [
      { 
        text: `
        Analyze the text of this resume and extract the contact information, skills, professional experience, and education.
        If any information is not found (e.g., LinkedIn), return null.

        I will provide you with the text of a resume, and you will extract the following information:

        contact[1]{name, email, phone, address, linkedIn}
          Jhon, jhon@me.com, 1234567890, New York - USA, https://linkedin.com/in/jhon
        skills[3]: git, docker, node
        experience[2]{role, company, startDate, endDate}
          Software Engineer, Google, 2022-01-01, 2023-01-01
        education[1]: {institution, degree, startDate, endDate}
          University of New York, Bachelor in Computer Science, 2018-01-01, 2022-01-01

        Return the information using only raw JSON format, with that structure, do not use any other format.

        At the end, add a new property on JSON called "recomendations", list 5 things that you would recommend the candidate to do. (use PT-BR only to recomendations)
      ` 
      },
      {
        inlineData: {
            mimeType: 'application/pdf',
            data: Buffer.from(fileBuffer).toString("base64")
        }
      }
  ];

  const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents
  });

  let rawResponse = response.text;

  if(!rawResponse) {
    return NextResponse.json({
      error: {
        tag: 'NO_RESPONSE_FOUND',
        message: 'Nenhuma resposta encontrada'
      }
    }, {
      status: 400
    });
  }

  if(rawResponse.startsWith('```json')) {
    rawResponse = rawResponse.replace('```json', '').replace('```', '');
  }

  const jsonResponse = rawResponse ? JSON.parse(rawResponse) : {};

  console.log(jsonResponse);

  const validation = ResumeSchema.safeParse(jsonResponse);

  if (!validation.success) {
    console.warn("IA retornou dados fora do esquema:", validation.error.issues);
  }

  return NextResponse.json(validation.data);
}