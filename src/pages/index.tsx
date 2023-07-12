import { CollapsePanelProps } from "antd";
import { useEffect, useState } from "react";
import { Project } from "../interface/project";
import { fetchUserRepositories, fetchUsers } from "../utils/api";
import { PageComponent } from "./components";

export default function Pages() {
  const [users, setUsers] = useState<Array<CollapsePanelProps>>([]);
  const [repositories, setRepositories] = useState<Project[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (!search) {
      setUsers([]);
      setRepositories([]);
    }
  }, [search]);

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const response = await fetchUsers(search);
    const items = response?.map((item: any) => {
      const temp: CollapsePanelProps = {
        key: item.id.toString(),
        header: item.login,
        children: "",
      };
      return temp;
    });
    setUsers(items);
    setIsLoading(false);
  };

  const handleClick = async (username: string) => {
    setRepositories([]);
    setActive(username === active ? "" : username);
    setIsLoading(true);
    const response = await fetchUserRepositories(username);
    setRepositories(response);
    setIsLoading(false);
  };

  return (
    <div>
      <PageComponent
        search={search}
        isLoading={isLoading}
        users={users}
        active={active}
        repositories={repositories}
        handleKeyDown={handleKeyDown}
        handleClick={(param) => handleClick(param)}
        setSearch={(param) => setSearch(param)}
        handleSearch={handleSearch}
      />
    </div>
  );
}
