import React from "react";

import SearchableSelect from "../SearchableSelect";

export default {
  title: "Input/SearchableSelect",
  component: "SearchableSelect",
  args: {
    // eslint-disable-next-line no-console
    onItemClick: console.log,
  },
};

const Template = (args) => <SearchableSelect {...args} />;

export const multiSelect = Template.bind({});
multiSelect.args = {
  options: [
    { uuid: "1", name: "Trevor Chalobah" },
    { uuid: "2", name: "Thiago Silva" },
    { uuid: "3", name: "Mason Mount" },
    { uuid: "4", name: "Raheem Sterling" },
  ],
  title: "Find users",
  optionId: "uuid",
  optionLabel: "name",
  searchByValue: "name",
  multiselect: true,
};

export const singleSelect = Template.bind({});
singleSelect.args = {
  options: [
    { id: "1", name: "Kai Havertz" },
    { id: "2", name: "Ngolo Kante" },
    { id: "3", name: "Malang Sarr" },
    { id: "4", name: "Mateo Kovacic" },
  ],
  title: "Find a user",
  optionId: "id",
  optionLabel: "name",
  searchByValue: "name",
};

export const multiWithSelectedValue = Template.bind({});
multiWithSelectedValue.args = {
  options: [
    { id: "1", subject: "Mathematics" },
    { id: "2", subject: "English Language" },
    { id: "3", subject: "Chemistry" },
    { id: "4", subject: "Physics" },
  ],
  title: "Add Subjects",
  optionId: "id",
  optionLabel: "subject",
  searchByValue: "subject",
  selectedValues: [
    { id: "1", subject: "Mathematics" },
    { id: "3", subject: "Chemistry" },
  ],
  multiselect: true,
  selectAllOptionValue: "-2",
};

export const singleWithSelectedValue = Template.bind({});
singleWithSelectedValue.args = {
  options: [
    { id: "1", room: "Alpine" },
    { id: "2", room: "Freddo" },
    { id: "3", room: "Summer" },
    { id: "4", room: "Glacier" },
  ],
  title: "Select a Meeting Room",
  optionId: "id",
  optionLabel: "room",
  searchByValue: "room",
  selectedValues: [{ id: "3", room: "Summer" }],
};
