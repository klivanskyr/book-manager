import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full' | 'xs' | undefined;
export default function ModalElement({ classNames={}, size='lg', active, Header, Body, Footer }: { classNames?: {}, size?: Size, active: boolean, Header: JSX.Element, Body: JSX.Element, Footer: JSX.Element }) {    
    return (
        <Modal size={size} isOpen={active} scrollBehavior='inside' classNames={classNames} shouldBlockScroll={true} placement='center'>
            <ModalContent>
                <ModalHeader>
                    {Header}
                </ModalHeader>
                <ModalBody>
                    {Body}
                </ModalBody>
                <ModalFooter>
                    {Footer}
                </ModalFooter>
            </ModalContent>
        </Modal>
        
    )
}