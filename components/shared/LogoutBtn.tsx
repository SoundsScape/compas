interface LogoutButtonProps {
    onLogout: () => void;
}
export default function LogoutButton({ onLogout }: LogoutButtonProps) {
    return (
        <button
            onClick={onLogout}
            className="my-4 mr-4 cursor-pointer rounded-sm bg-white/20 px-6 py-1.5 transition-all duration-500 hover:bg-white/40 hover:drop-shadow-[0px_0px_10px_rgba(255,255,255,0.5)]"
        >
            Logout
        </button>
    );
}
