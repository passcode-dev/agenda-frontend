import { Home, UserCog, Layers, BookMarked, Users, GraduationCapIcon, CalendarRange } from 'lucide-react'


export const Items = [
  {
    title: "Início",
    icon: Home,
    variant: "default",
    href: "/admin"
  },
  {
    title: "Agenda",
    icon: CalendarRange,
    variant: "default",
    href: "/admin/agenda"
  },
  {
    title: "Alunos",
    icon: GraduationCapIcon,
    variant: "default",
    href: "/admin/alunos"
  },
  {
    title: "Cursos",
    icon: BookMarked,
    variant: "default",
    href: "/admin/cursos"
  },
  {
    title: "Professores",
    icon: Users,
    variant: "default",
    href: "/admin/professores"
  },
  {
    title: "Turmas",
    icon: Layers,
    variant: "default",
    href: "/admin/turmas"
  },
  {
    title: "Usuários",
    icon: UserCog,
    variant: "default",
    href: "/admin/usuarios"
  }
]