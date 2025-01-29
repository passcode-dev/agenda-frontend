import { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Items } from "./nav-items";
import { LogOut, Menu, X } from "lucide-react";
import { UserContext } from "@/app/context/userContext";
import styled from "styled-components";

// LinkStyled agora usa $isActive
const LinkStyled = styled.a`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 12px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  color: ${({ $isActive }) => ($isActive ? "#2563eb" : "#4b5563")};
  background-color: ${({ $isActive }) => ($isActive ? "#e0f2fe" : "transparent")};

  &:hover {
    background-color: ${({ $isActive }) =>
    $isActive ? "#dbeafe" : "#f3f4f6"};
    color: ${({ $isActive }) => ($isActive ? "#1d4ed8" : "#1f2937")};
  }
`;

// Usando $isOpen em vez de isOpen
const AsideBar = styled(({ $isOpen, ...props }) => <aside {...props} />)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: #ffffff;
  transition: width 0.3s ease, opacity 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;

  ${({ $isOpen }) =>
    $isOpen
      ? `width: 280px; opacity: 1;`
      : `width: 64px; opacity: 0.95;`}
`;

const LabelSection = styled.span`
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-20px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  padding-left: 16px;
  padding-top: 24px;
  padding-bottom: 16px;
  height: 60px;
  width: 100%;
`;

const UserSection = styled.div`
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-20px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const Avatar = styled.div`
  background-color: #e5e7eb;
  color: #374151;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  min-width: 40px;
  min-height: 40px;
`;

const LogoutButton = styled(Button)`
  gap: 24px;
  width: 100%;
  justify-content: start;
  color: #4b5563;
  height: 60px;
  padding: 8px 12px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }
`;

const LogOutSpan = styled.span`
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(-20px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  font-size: 1rem;
  font-weight: 600;
`;

const LogOutIcon = styled(LogOut)`
  width: 24px !important;
  height: 24px !important;
`;

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [NavItems, setNavItems] = useState(Items);
  const { user } = useContext(UserContext);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => !isMobile && setIsOpen(false);

  return (
    <>
      {isMobile && !isOpen && (
        <Menu
          onClick={() => setIsOpen(true)}
          className="cursor-pointer text-gray-600 absolute top-4 left-4"
          size={24}
          aria-label="Open Sidebar"
        />
      )}

      {(!isMobile || isOpen) && (
        <AsideBar
          ref={sidebarRef}
          $isOpen={isOpen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-expanded={isOpen}
        >
          <div className="flex flex-col h-full">
            {isMobile && (
              <div className="flex justify-end p-4">
                <X
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer text-gray-600"
                  size={24}
                  aria-label="Close Sidebar"
                />
              </div>
            )}

            <UserInfo $isOpen={isOpen}>
              <Avatar>
                {user?.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <UserSection $isOpen={isOpen}>
                <p className="font-semibold text-lg text-gray-800 capitalize">{user?.username}</p>
                <p className="font-semibold text-sm text-gray-500">{user?.email}</p>
              </UserSection>
            </UserInfo>

            <Separator className="my-2" />

            <nav className="flex flex-col px-2">
              {NavItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <LinkStyled
                    key={index}
                    href={item.href}
                    $isActive={isActive}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>
                      <item.icon size="24px" />
                    </span>
                    <LabelSection $isOpen={isOpen}>
                      {item.title}
                    </LabelSection>
                  </LinkStyled>
                );
              })}
            </nav>

            <div className="mt-auto border-t px-2 py-2">
              <LogoutButton $isOpen={isOpen} variant="link">
                <LogOutIcon $isOpen={isOpen} />
                <LogOutSpan $isOpen={isOpen}>Logout</LogOutSpan>
              </LogoutButton>
            </div>
          </div>
        </AsideBar>
      )}
    </>
  );
}
