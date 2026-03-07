import TextArea from "../block/textArea";

interface TextAreaType {
  value: string;
}

interface Plantilla2Props {
  index: number;
  textAreas: TextAreaType[];
  shortCitation: string;
  setTextAreas: (areas: TextAreaType[]) => void;
  setShortCitation: (value: string) => void;
}

export default function Plantilla2({ textAreas, shortCitation, setTextAreas, setShortCitation, index }: Plantilla2Props) {
  const handleTextAreaChange = (idx: number, value: string) => {
    const updated = [...textAreas];
    updated[idx].value = value;
    setTextAreas(updated);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white/5 backdrop-blur-sm border rounded-md transition-all duration-300 hover:border-accent/20">
      <div className="flex flex-col gap-6">
        <TextArea
          placeholder="Contenido extenso del artículo..."
          maxCharacters={index === 0 ? 2200 : 2700}
          textArea={textAreas[0]?.value ?? ''}
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
  );
}
