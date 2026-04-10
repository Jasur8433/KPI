import { Card } from '../components/ui';

export function GenericPage({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>
      <p>{description}</p>
    </Card>
  );
}
