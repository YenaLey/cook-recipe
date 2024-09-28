export default function SwaggerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="apidocs-container">{children}</div>;
}
