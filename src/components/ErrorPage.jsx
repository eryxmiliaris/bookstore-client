function ErrorPage({ error }) {
  console.error(error);
  return <p>Error occured: {error.message}</p>;
}

export default ErrorPage;
