import { Accordion, AccordionItem } from "@nextui-org/react";

export type Section = {
    startContent: JSX.Element;
    subsections: JSX.Element[];
};

export type SideBarSections = {
    [key: string]: Section;
}

export default function SideBar({ sections }: { sections: SideBarSections }) {
    return (
        <div className='w-[400px] h-[850px] border p-2 shadow-md rounded-lg'>
            <Accordion className='h-full' selectionMode="multiple" variant="bordered">
                {Object.entries(sections).map(([section, { startContent, subsections }], index) => {
                    return (
                        <AccordionItem className='my-1' key={index} title={section} aria-label={section} startContent={startContent}>
                            {subsections.map((subsection, index) => (
                                <div key={index}>{subsection}</div>
                            ))}
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}