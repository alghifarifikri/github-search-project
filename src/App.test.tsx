import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { PageComponent } from "./pages/components";
import { Project } from "./interface/project";
// import { fetchUserRepositories, fetchUsers } from "./utils/api";
import * as apiUtils from "./utils/api";
import Pages from "./pages";

describe("PageComponent", () => {
  const mockProps = {
    search: "test",
    isLoading: false,
    users: [
      {
        key: "1",
        header: "User 1",
        children: "",
      },
      {
        key: "2",
        header: "User 2",
        children: "",
      },
    ],
    active: "User 1",
    repositories: [
      {
        id: "1",
        name: "Repo 1",
        description: "Description 1",
        stargazers_count: 5,
      },
      {
        id: "2",
        name: "Repo 2",
        description: "Description 2",
        stargazers_count: 10,
      },
    ] as unknown as Project[], // Tambahkan tipe Project[]
    handleKeyDown: jest.fn(),
    handleClick: jest.fn(),
    setSearch: jest.fn(),
    handleSearch: jest.fn(),
  };

  it("renders input and button", () => {
    render(<PageComponent {...mockProps} />);
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
  });

  it("calls handleKeyDown when Enter key is pressed", () => {
    render(<PageComponent {...mockProps} />);
    const input = screen.getByTestId("input");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockProps.handleKeyDown).toHaveBeenCalled();
  });

  it("calls handleSearch when button is clicked", () => {
    render(<PageComponent {...mockProps} />);
    const button = screen.getByTestId("button");
    fireEvent.click(button);
    expect(mockProps.handleSearch).toHaveBeenCalled();
  });

  it("displays search term", () => {
    render(<PageComponent {...mockProps} />);
    expect(
      screen.getByText(`Showing users for "${mockProps.search}"`)
    ).toBeInTheDocument();
  });

  it("displays user panels", () => {
    render(<PageComponent {...mockProps} />);
    const user1Panel = screen.getByText("User 1");
    const user2Panel = screen.getByText("User 2");
    expect(user1Panel).toBeInTheDocument();
    expect(user2Panel).toBeInTheDocument();
  });

  it("calls handleClick when user panel is clicked", () => {
    render(<PageComponent {...mockProps} />);
    const user1Panel = screen.getByText("User 1");
    fireEvent.click(user1Panel);
    expect(mockProps.handleClick).toHaveBeenCalledWith("User 1");
  });

  it("displays repositories for active user", async () => {
    render(<PageComponent {...mockProps} />);
    const user1Panel = screen.getByText("User 1");
    fireEvent.click(user1Panel);
    const repo1Name = await screen.findByText("Repo 1");
    const repo2Name = await screen.findByText("Repo 2");
    expect(repo1Name).toBeInTheDocument();
    expect(repo2Name).toBeInTheDocument();
  });
});

jest.mock("./utils/api");

describe("Pages", () => {
  const mockUsers = [
    {
      id: 1,
      login: "user1",
    },
    {
      id: 2,
      login: "user2",
    },
  ];

  const mockRepositories = [
    {
      id: 1,
      name: "repo1",
      description: "Repo 1",
      stargazers_count: 5,
    },
    {
      id: 2,
      name: "repo2",
      description: "Repo 2",
      stargazers_count: 10,
    },
  ];

  beforeEach(() => {
    jest.spyOn(apiUtils, "fetchUsers").mockResolvedValue(mockUsers);
    jest
      .spyOn(apiUtils, "fetchUserRepositories")
      .mockResolvedValue(mockRepositories);
  });

  it("renders correctly", async () => {
    render(<Pages />);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("displays user panels after search", async () => {
    render(<Pages />);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(button);

    await waitFor(async () => {
      await expect(screen.getByText("user1")).toBeInTheDocument();
      await expect(screen.getByText("user2")).toBeInTheDocument();
    });
  });

  it("displays repositories after user panel is clicked", async () => {
    render(<Pages />);
    const input = screen.getByTestId("input");
    const button = screen.getByTestId("button");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(button);

    await waitFor(async () => {
      // eslint-disable-next-line testing-library/no-wait-for-side-effects
      fireEvent.click(screen.getByText("user1"));
      await expect(screen.findByText("repo1")).resolves.toBeInTheDocument();
      await expect(screen.findByText("repo2")).resolves.toBeInTheDocument();
    });
  });
});
