
interface SpanDecimalNumbersProps {
    text: string;
    fontSize: number;
  }
  
  export function SpanDecimalNumbers({ text, fontSize }: SpanDecimalNumbersProps): JSX.Element {
    const regex = /(\d+\.\d+)/g;
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          part.match(regex) ? (
            <span key={index}>
              <span>{part.split(".")[0]}</span>
              <span style={{ fontSize: `${fontSize}px` }}>
                .{part.split(".")[1]}
              </span>
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }