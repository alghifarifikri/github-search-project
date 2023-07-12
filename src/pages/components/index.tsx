import { Button, Card, Collapse, Input, Spin } from "antd";
import React from "react";
import { PageComponentProps } from "../../interface/page-component";
import { StarFilled } from "@ant-design/icons";

export const PageComponent: React.FC<PageComponentProps> = ({
  search,
  isLoading,
  users,
  active,
  repositories,
  handleKeyDown,
  handleClick,
  setSearch,
  handleSearch,
}) => {
  return (
    <div>
      <Input
        value={search}
        data-testid="input"
        allowClear
        placeholder="Enter Username"
        onChange={(param) => setSearch(param.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="App">
        <Button
          data-testid="button"
          className="mt-2persen mb-2persen full-width"
          type="primary"
          onClick={handleSearch}
          loading={isLoading ? true : false}
        >
          Search
        </Button>
      </div>
      {search && (
        <div className="mb-2persen mt-2persen font-gray">
          {" "}
          Showing users for "{search}"
        </div>
      )}
      {users?.length > 0 && (
        <div>
          {users.map((user: any) => (
            <Collapse
              key={user.key}
              data-testid="collapse"
              expandIconPosition={"end"}
              accordion
              activeKey={active === user.header ? user.key : undefined}
              onChange={() => handleClick(user.header as string)}
            >
              <Collapse.Panel header={user.header} key={user.key}>
                {isLoading && (
                  <div className="App">
                    <Spin />
                  </div>
                )}
                {repositories?.length === 0 && !isLoading && (
                  <div className="App">Data Empty</div>
                )}
                {repositories.map((repo: any) => (
                  <Card
                    className="mb-2persen"
                    style={{
                      background: "#E0E0E0",
                    }}
                  >
                    <div className="d-flex">
                      <div className="w-70persen">
                        <div>
                          <div className="font-bold">{repo.name}</div>
                        </div>
                        <div>
                          <div>{repo.description}</div>
                        </div>
                      </div>
                      <div className="dflex-mlauto">
                        <div>{repo.stargazers_count}</div>
                        <div style={{ marginLeft: 5 }}>
                          <StarFilled />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Collapse.Panel>
            </Collapse>
          ))}
        </div>
      )}
    </div>
  );
};
