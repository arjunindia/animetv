import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Link, useNavigate } from "@tanstack/react-router";
import { Home, Package2, Search, Settings, Dog } from "lucide-react";
import React from "react";
import {
  useFocusable,
  FocusContext,
} from "@noriginmedia/norigin-spatial-navigation";
const NavLink = ({
  Icon,
  name,
}: {
  Icon: React.ComponentType<any>;
  name: string;
}) => {
  const navigate = useNavigate();
  const { ref, focused } = useFocusable({
    onFocus: () => {
      ref.current.focus();
    },
    onBlur: () => {
      ref.current.blur();
    },
    onEnterRelease: () => {
      navigate({
        to: `/${name.toLowerCase() === "home" ? "" : name.toLowerCase()}`,
      });
    },
  });
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            ref={ref}
            to={`/${name.toLowerCase() === "home" ? "" : name.toLowerCase()}`}
            className={`flex mb-6 h-9 w-9 items-center justify-center [&.active]:bg-secondary rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${focused ? "outline outline-primary" : "button"}`}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{name}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Nav = () => {
  const { ref, focusKey, focusSelf } = useFocusable({
    forceFocus: true,
    autoRestoreFocus: true,
  });
  React.useEffect(() => {
    focusSelf();

    // alternatively
    // setFocus('BUTTON_PRIMARY');
  }, [focusSelf]);
  return (
    <FocusContext.Provider value={focusKey}>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav
          ref={ref}
          className="flex flex-col items-center gap-4 px-2 sm:py-5"
        >
          <Link
            to="/"
            className="group mb-6 flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <NavLink name="Home" Icon={Home} />
          <NavLink name="Search" Icon={Search} />
          <NavLink name="Query" Icon={Dog} />
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <NavLink name="Settings" Icon={Settings} />
        </nav>
      </aside>
    </FocusContext.Provider>
  );
};
