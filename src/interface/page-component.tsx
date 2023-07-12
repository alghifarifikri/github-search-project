import { CollapsePanelProps } from "antd";
import { Project } from "./project";

export interface PageComponentProps {
  search: string;
  isLoading: boolean;
  users: CollapsePanelProps[];
  active: string | null;
  repositories: Project[];
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleClick: (username: string) => void;
  setSearch: (search: string) => void;
  handleSearch: () => void;
}
