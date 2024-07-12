import { Check, Plus } from "@/assets"
import { motion } from "framer-motion"


export default function FollowButton({ className='', isFollowing, onClick }: { className?: string, isFollowing: boolean; onClick: Function }): JSX.Element {
    const variants = {
        initial: { rotate: 0, scale: 1 },
        animate: { rotate: 360, scale: 1.2, transition: { duration: 0.5 } },
    };

    return (
        <motion.div
            className={className}
            onClick={(e) => onClick()}
            animate="animate"
            initial="initial"
            variants={variants}
        >
            {isFollowing ? (
                <Check className='h-[30px] w-[30px]' />
            ) : (
                <Plus className='h-[30px] w-[30px]' />
            )}
        </motion.div>
    );
}