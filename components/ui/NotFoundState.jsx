import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFoundState({ title, description, actionLabel, actionHref }) {
  return (
    <Container className="flex flex-col items-start gap-4 py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">404</p>
      <h1 className="font-heading text-3xl font-semibold text-navy-900 sm:text-4xl">{title}</h1>
      <p className="max-w-xl text-base leading-relaxed text-muted-600">{description}</p>
      <Button href={actionHref} variant="primary">
        {actionLabel}
      </Button>
    </Container>
  );
}
