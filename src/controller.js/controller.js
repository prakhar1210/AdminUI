export const saveItemToTheData = (name, email, role, id, data, setData) => {
  const copyData = [...data];
  let obj;
  const foundItem = copyData.find((o) => {
    if (o.id === id) {
      obj = { ...o, name: name, email: email, role: role };
    }
  });

  return { ...copyData, [id - 1]: obj };
};

export const sortItemsPerPage = (
  setDataPerPage,
  filteredData,
  itemsPerPage,
  currentPage
) => {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ensure currentPage is within valid bounds
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Extract the data for the current page
  const pageData = filteredData.slice(startIndex, endIndex);

  // Set the paginated data using the provided setDataPerPage function
  setDataPerPage(pageData);
  // console.log(pageData);
};
