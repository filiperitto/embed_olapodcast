fetch("https://api.olapodcasts.com/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `
    query {
      todos {
        edges {
          node {
            completed
            id
            text
          }
	}
      }
    }`,
  }),
});
