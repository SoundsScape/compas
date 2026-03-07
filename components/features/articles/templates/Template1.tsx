import ImageBlock from "../block/imagen";
import TextArea from "../block/textArea";


interface Plantilla1Props {
  index: number;
  textAreas: { value: string }[];
  imageAreas: { imageFile: File | null | string; imageFooter: string }[];
  setTextAreas: (newArray: { value: string }[]) => void;
  setImageAreas: (newArray: { imageFile: File | null | string; imageFooter: string }[]) => void;
  shortCitation: string;
  setShortCitation: (value: string) => void;
}

export default function Plantilla1({
  textAreas,
  imageAreas,
  shortCitation,
  setTextAreas,
  setImageAreas,
  setShortCitation,
  index
}: Plantilla1Props) {

  const handleTextAreaChange = (idx: number, value: string) => {
    const newTextAreas = [...textAreas];
    newTextAreas[idx].value = value;
    setTextAreas(newTextAreas);
  };

  const handleImageFileChange = (idx: number, file: File | null) => {
    const newImageAreas = [...imageAreas];
    newImageAreas[idx].imageFile = file;
    setImageAreas(newImageAreas);
  };

  const handleImageFooterChange = (idx: number, foot: string) => {
    const newImageAreas = [...imageAreas];
    newImageAreas[idx].imageFooter = foot;
    setImageAreas(newImageAreas);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white/5 backdrop-blur-sm border rounded-md transition-all duration-300 hover:border-accent/20">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <ImageBlock
            imageArea={imageAreas[0]}
            onFileChange={(file) => handleImageFileChange(0, file)}
            onFootChange={(foot) => handleImageFooterChange(0, foot)}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col gap-6">
          <TextArea
            placeholder="Contenido principal del bloque..."
            maxCharacters={index === 0 ? 1500 : 2000}
            textArea={textAreas[0].value ?? ''}
            onChange={(value) => handleTextAreaChange(0, value)}
          />
          <TextArea
            placeholder="Cita destacada o breve comentario..."
            maxCharacters={240}
            textArea={shortCitation ?? ''}
            onChange={setShortCitation}
          />
        </div>
      </div>
    </div>
  );
}
