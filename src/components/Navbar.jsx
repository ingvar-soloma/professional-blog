import React from 'react';
import { Mail, Sun, Moon, LogOut } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Stack,
  Container,
  Button,
  Text,
  GithubIcon
} from './primitives/SystemicEngine';

export default function Navbar() {
  const { user, isOwner, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md h-20 flex items-center justify-center">
      <Container size="7xl">
        <Stack vertical={false} align="center" justify="between" fullWidth>
          <Stack vertical={false} align="center" gap={4} as={Link} to="/">
            <div className="h-11 w-11 bg-red-600 flex items-center justify-center font-black text-white shrink-0 text-xl">IS</div>
            <Text mono color="text-white" weight="bold" className="text-sm tracking-[0.15em] hidden sm:block">Architect.Registry</Text>
          </Stack>

          <Stack vertical={false} gap={10} align="center">
            <ul className="hidden md:flex items-center gap-10 text-sm font-mono uppercase tracking-[0.2em]">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => cn(
                    "transition-colors",
                    isActive ? "text-red-600" : "text-gray-500 hover:text-white"
                  )}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className={({ isActive }) => cn(
                    "transition-colors",
                    isActive ? "text-red-600" : "text-gray-500 hover:text-white"
                  )}
                >
                  Blog
                </NavLink>
              </li>
              {isOwner && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => cn(
                      "transition-colors",
                      isActive ? "text-red-600" : "text-gray-500 hover:text-white"
                    )}
                  >
                    Control
                  </NavLink>
                </li>
              )}
            </ul>

            <Stack vertical={false} align="center" gap={3}>
              <Button
                label="Source"
                variant="outline"
                icon={GithubIcon}
                as="a"
                href="https://github.com/ingvar-soloma"
                target="_blank"
                size="sm"
              />
              <Button
                label="Contact"
                icon={Mail}
                as="a"
                href="mailto:ingvar.soloma@gmail.com"
                size="sm"
              />
              {user && (
                <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                  <LogOut size={16} />
                </button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </header>
  );
}

const cn = (...classes) => classes.filter(Boolean).join(' ');
