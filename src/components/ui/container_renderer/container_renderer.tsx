import { useEffect, type ReactElement } from "react";
import TrainingVideo from "../training_video/training_video";
import TrainingDeepLink from "./training_deeplink";
import TrainingExcel from "./training_excel";
import TrainingIframe from "./training_iframe";
import TrainingPdf from "./training_pdf";
import TrainingWord from "./training_word";

type ContentType =
  | "Videos"
  | "presentation"
  | "pdf"
  | "excel"
  | "word"
  | "deeplink"
  | "web";


  interface SubmoduleData {
    submodule_id: string;
    module_id: string;
    name: string;
    description: string;
    content_type: string;
    content_url: string;
    order_index: string;
    duration: string;
    created_at: string;
}
const ContentRenderer = ({ submoduleData }: { submoduleData: SubmoduleData }) => {



    useEffect(()=>{
        console.log("Rendering content for type:", submoduleData.content_type);
    })
  const type = submoduleData.content_type as ContentType;

  const url = submoduleData.content_url;

  const COMPONENT_MAP: Record<ContentType, ReactElement> = {
    Videos: <TrainingVideo video_url={url} />,
    presentation: <TrainingIframe url={url} />,
    pdf: <TrainingPdf pdf_url={url} />,
    excel: <TrainingExcel file_url={url} />,
    word: <TrainingWord file_url={url} />,
    deeplink: <TrainingDeepLink url={url} />,
    web: <TrainingIframe url={url} />,
  };

  return COMPONENT_MAP[type] ?? (
    <>
    <h1>{ submoduleData?.content_type }</h1>
    <h1>{ submoduleData?.content_url }</h1>
    <div className="text-red-500">
      Unsupported content type: {submoduleData.content_type}
    </div>
    </>
  );
};

export default ContentRenderer;
