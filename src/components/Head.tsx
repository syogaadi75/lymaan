import { Helmet } from "react-helmet";

type PropsHelmet = {
  title: string;
  description: string;
};

const Head = ({ description, title }: PropsHelmet) => {
  return (
    <Helmet title={title}>
      <meta name="description" content={description} />
    </Helmet>
  );
};

Head.defaulProps = {
  title: "Lymaas",
  description: "Lymaas dashboard admin",
};

export default Head;
