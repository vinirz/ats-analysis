import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResumeResponseContent } from '@/app/lib/ai-response';
import { ChartRadialText } from '@/components/ui/radial-chart';
import { findEmptyFields } from '../../lib/find-empty-fields';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const TOTAL_RESUME_FIELDS = 16
const fieldName = {
  contact: {
    name: 'Seu Nome',
    email: 'Seu Email',
    phone: 'Seu Telefone',
    address: 'Seu Endereço',
    linkedIn: 'Seu LinkedIn'
  },
  skills: 'Campo Habilidades',
  experience: {
    role: 'O Cargo de Trabalho',
    company: 'A Empresa em que Trabalhou',
    startDate: 'Data de Início da Experiência Profissional',
    endDate: 'Data de Término da Experiência Profissional'
  },
  education: {
    institution: 'Instituição de Ensino',
    degree: 'Grau Acadêmico Obtido',
    startDate: 'Data de Início da Experiência Acadêmica',
    endDate: 'Data de Término da Experiência Acadêmica'
  }
}

export default function Results({analysisResult}: { analysisResult: ResumeResponseContent }) {
  const emptyFields = findEmptyFields(analysisResult); 
  const resumeScore = Math.round((TOTAL_RESUME_FIELDS - emptyFields.length) * 100 / TOTAL_RESUME_FIELDS)
  const tabs = [
    {
      name: 'Visão Geral',
      value: 'overview',
      content: (
        <div className='flex flex-col gap-12'>
          <h1 className='text-lg'>
            Seu currículo foi analisado e recebeu uma pontuação de <br/><span className='font-bold text-2xl'>{resumeScore} pontos</span> com base nos requisitos preenchidos.
          </h1>
          <div className='flex flex-col lg:flex-row w-full justify-around gap-12'>
            <div className='flex flex-col h-fit lg:h-96 gap-5 w-full overflow-x-hidden overflow-y-auto'>
              {
                emptyFields.length > 0 ?  emptyFields?.map((field) => (
                  <div key={field} className='p-4 mr-4 bg-red-100 rounded-md w-full'>
                    <h3 className='font-semibold text-red-700'>Falta: {eval(`fieldName.${field}`)}</h3>
                  </div>
                )) : (
                  <div className='p-4 mr-4 bg-emerald-100 rounded-md w-full'>
                    <h3 className='font-semibold text-emerald-700'>
                      Parabéns! Seu currículo preenche todos os requisitos analisados.
                      <br/>
                      <br/>
                      Para continuar melhorando, considere aplicar as nossar recomendações. 
                      Você pode encontra-las na aba "Recomendações", ao final do menu a cima.
                    </h3>
                  </div>
                )
              }
            </div>

            <ChartRadialText points={resumeScore}/>
          </div>
        </div>
      )
    },
    {
      name: 'Informações obtidas',
      value: 'informations',
      content: (
        <div className='h-1/3 w-full flex flex-col gap-5'>
          <h1 className='text-lg'>
            Utilizando um agente de IA, conseguimos extrair algumas informações do seu currículo, recrutadores podem filtrar candidatos com base nesses dados:
          </h1>
          <div className='flex flex-col gap-5 h-96 overflow-y-auto shrink-0 grow-0'>
            <Accordion type="single" collapsible className='border-2 px-5 rounded-md bg-white shaddow-md'>
              <AccordionItem value="contacts">
                <AccordionTrigger className='font-medium text-xl'>Informações de Contato</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-5 mt-5'>
                  <div className='text-lg'>
                    <p className='font-medium text-lg'>Nome:</p>
                    <p>{analysisResult.contact?.name || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                  </div>
                  <div className='text-lg'>
                    <p className='font-medium text-lg'>Email:</p>
                    <p>{analysisResult.contact?.email || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                  </div>
                  <div className='text-lg'>
                    <p className='font-medium text-lg'>Telefone:</p>
                    <p>{analysisResult.contact?.phone || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                  </div>
                  <div className='text-lg'>
                    <p className='font-medium text-lg'>Endereço:</p>
                    <p>{analysisResult.contact?.address || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                  </div>
                  <div className='text-lg'>
                    <p className='font-medium text-lg'>Linkedin:</p>
                    <p>{analysisResult.contact?.linkedIn || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className='border-2 px-5 rounded-md bg-white shaddow-md'>
              <AccordionItem value="contacts">
                <AccordionTrigger className='font-medium text-xl'>Habilidades</AccordionTrigger>
                <AccordionContent className='grid grid-cols-4 gap-3 mt-5'>
                  {
                    analysisResult.skills && analysisResult.skills.length > 0 ? (
                      analysisResult.skills.map((skill) => (
                        <div key={skill} className='w-full text-center text-lg'>
                          <p>{skill}</p>
                        </div>
                      ))
                    ) : <span className='text-red-500'>Campo Vazio</span>
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className='border-2 px-5 rounded-md bg-white shaddow-md'>
              <AccordionItem value="contacts">
                <AccordionTrigger className='font-medium text-xl'>Experiências Profissionais</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-5 mt-5'>
                  {
                    analysisResult.experience && analysisResult.experience.length > 0 ? (
                      analysisResult.experience.map((exp, index) => {
                        const isLast = index === analysisResult.experience.length - 1
                        return (
                          <div key={index} className={`flex flex-col gap-3 ${!isLast ? 'border-b-3 pb-5' : ''}`}>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Cargo:</p>
                              <p>{exp?.role || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Empresa:</p>
                              <p>{exp?.company || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Data de Início:</p>
                              <p>{exp?.startDate || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Data de Fim:</p>
                              <p>{exp?.endDate || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                          </div>
                        )
                      })
                    ) : <span className='text-red-500'>Campo Vazio</span>
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible className='border-2 px-5 rounded-md bg-white shaddow-md'>
              <AccordionItem value="contacts">
                <AccordionTrigger className='font-medium text-xl'>Experiências Acadêmicas</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-5 mt-5'>
                  {
                    analysisResult.education && analysisResult.education.length > 0 ? (
                      analysisResult.education.map((exp, index) => {
                        const isLast = index === analysisResult.education.length - 1
                        return (
                          <div key={index} className={`flex flex-col gap-3 ${!isLast ? 'border-b-3 pb-5' : ''}`}>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Instituição:</p>
                              <p>{exp?.institution || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Grau de Escolaridade:</p>
                              <p>{exp?.degree || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Data de Início:</p>
                              <p>{exp?.startDate || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                            <div className='text-lg'>
                              <p className='font-medium text-lg'>Data de Fim:</p>
                              <p>{exp?.endDate || (<span className='text-red-500'>Campo Vazio</span>)}</p>
                            </div>
                          </div>
                        )
                      })
                    ) : <span className='text-red-500'>Campo Vazio</span>
                  }
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )
    },
    {
      name: 'Recomendações',
      value: 'recomendations',
      content: (
        <div className='h-1/3 w-full flex flex-col gap-5'>
          <h1 className='text-lg mb-5'>
            Você pode melhorar ainda mais o seu currículo seguindo algumas recomendações <br/> geradas para aumentar suas chances de ser selecionado por recrutadores:
          </h1>
          <div className='flex flex-col gap-5 h-96 overflow-y-auto overflow-x-hidden shrink-0 grow-0'>
            {
              analysisResult.recomendations && analysisResult.recomendations.length > 0 ? (
                <>
                  {
                    analysisResult.recomendations.map((rec, index) => (
                      <div key={rec} className='p-4 mr-4 bg-emerald-100 rounded-md w-full'>
                        <span className='font-bold text-xl mr-2'>{index + 1}.</span>
                        <h3 className='text-emerald-700'>
                          {rec}
                        </h3>
                      </div>
                    ))
                  }
                </>
              ) : <span className='text-red-500'>Nenhuma recomendação disponível.</span>
            }
          </div>
        </div>
      )
    }
  ];

  const TabsComponent = () => {
    return (
      <div className='lg:w-2/3'>
        <Tabs defaultValue='overview'>
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className='mt-12 overflow-x-hidden overflow-y-auto'>
              <p className='text-muted-foreground text-sm'>{tab.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    )
  };
  
  return (
    <div className='flex lg:items-center justify-center w-screen h-screen bg-gray-50 overflow-hidden'>
      <TabsComponent/>  
    </div>
  )
}