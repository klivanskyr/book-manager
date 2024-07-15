import { Check, Plus } from "@/assets"
import { AnimatePresence, motion } from "framer-motion"


export default function FollowButton({ className='', isFollowing, onClick }: { className?: string, isFollowing: boolean; onClick: Function }): JSX.Element {

    return (
        <div onClick={(e) => onClick()} className={`${className}`}>
            <AnimatePresence initial={false}>
                {isFollowing ? (
                <motion.div
                    key="check"
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute h-[30px] w-[30px]"
                >
                    <Check className="h-full w-full" />
                </motion.div>
                ) : (
                <motion.div
                    key="plus"
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="absolute h-[30px] w-[30px]"
                >
                    <Plus className="h-full w-full" />
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}