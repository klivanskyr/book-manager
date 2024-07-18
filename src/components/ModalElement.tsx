import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | 'xs' | undefined;
type Placement = 'auto' | 'top' | 'bottom' | 'center' | 'top-center' | 'bottom-center' 
export default function ModalElement({ placement='center', classNames={}, size='lg', onOpenChange=()=>{}, active, Header, Body, Footer }: { placement?: Placement, classNames?: {}, size?: Size, onOpenChange?: (isOpen: boolean) => void, active: boolean, Header: JSX.Element, Body: JSX.Element, Footer?: JSX.Element }) {    
    return (
        <Modal size={size} isOpen={active} onOpenChange={onOpenChange} scrollBehavior='inside' classNames={classNames} shouldBlockScroll={true} placement={placement}>
            <ModalContent>
                <ModalHeader>
                    {Header}
                </ModalHeader>
                <ModalBody>
                    {Body}
                </ModalBody>
                {Footer && <ModalFooter>
                    {Footer}
                </ModalFooter>}
            </ModalContent>
        </Modal>
        
    )
}