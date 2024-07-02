import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import Shelf from "./Shelf/Shelf";
import { bookIcon } from "@/assets";

export default function TEST({ isLoading, setIsLoading }: { isLoading: boolean, setIsLoading: Function }) {
    return (
        <div className="mx-2">
            <Accordion className='' variant="splitted">
                <AccordionItem key='1' title='All Books' startContent={
                    <Avatar 
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-full"
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