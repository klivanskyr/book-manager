import { Accordion, AccordionItem, Image } from "@nextui-org/react";
import Shelf from "./Shelf/Shelf";
import { bookIcon } from "@/assets";

export default function TEST({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
    return (
        <div className="mx-2">
            <Accordion className='' variant="splitted">
                <AccordionItem key='1' title='All Books' startContent={
                    <Image 
                        className="p-1.5 w-[50px] h-[50px] bg-slate-50 border border-slate-200 rounded-full"
                        radius="lg"
                        src={bookIcon.src}
                    />
                }>
                    <Shelf isLoading={isLoading} setIsLoading={setIsLoading} />
                </AccordionItem>
            </Accordion>
        </div>
    )
}