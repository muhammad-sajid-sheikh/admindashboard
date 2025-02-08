export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-05'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)


export const token = assertValue(
  "skvtHaiVSyq6fqboBXLXwxf3iW3RidzMoJNv0Ny5bLy3qbDfS9Ow4cVlCgwr5v5KytAFvx7bFkVnkh6yg5HqyASR5E2RLtqNyeB82XIb2QfYOr3NqkwYOlOySOz4To1NS6E7ZLdgjopvHPZDx5qHwYQWlKzcfrZ43cFQHXrCJWp6BbDZ88iU",
  'Missing environment variable: SANITY_API_TOKEN'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
