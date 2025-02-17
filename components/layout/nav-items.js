import { Home, UserCog, Layers, BookMarked, Users, GraduationCapIcon, CalendarRange, Book } from 'lucide-react';

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
    title: "Classes",
    icon: Layers,
    variant: "default",
    href: "/admin/classes"
  },
  {
    title: "Matérias",
    icon: Book,
    variant: "default",
    href: "/admin/materias"
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
    icon: Users,
    variant: "default",
    href: "/admin/usuarios"
  },
  {
    title: "Perfil",
    icon: UserCog,
    variant: "default",
    href: "/admin/perfil"
  }
];
