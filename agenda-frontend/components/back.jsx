import Link from "next/link";
export default function Back({ icon, text, href }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
            {icon}
            {text}
        </Link>
    );
}