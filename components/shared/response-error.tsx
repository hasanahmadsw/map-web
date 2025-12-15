function ResponseError({ error }: { error: Error | null }) {
  if (!error) return null;

  return (
    <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-3">
      <p className="text-destructive text-sm">{error?.message || 'An error occurred.'}</p>
    </div>
  );
}

export default ResponseError;
