import Gameboard from "@/components/gameboard";

type Props = {
  params: {
    gameid: string;
  };
};

export default async function Concert({ params }: Props) {
  return (
    <div>
      <Gameboard gameId={params.gameid} />
    </div>
  );
}
