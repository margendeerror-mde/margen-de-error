export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const HistoriasPartsFragmentDoc = gql`
    fragment HistoriasParts on Historias {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const ConflictosPartsFragmentDoc = gql`
    fragment ConflictosParts on Conflictos {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const SerendipiaPartsFragmentDoc = gql`
    fragment SerendipiaParts on Serendipia {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const AnalisisPartsFragmentDoc = gql`
    fragment AnalisisParts on Analisis {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const MarcoPartsFragmentDoc = gql`
    fragment MarcoParts on Marco {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const PodcastPartsFragmentDoc = gql`
    fragment PodcastParts on Podcast {
  __typename
  titulo
  seccion
  industria
  mecanismo
  tema
  fecha
  resumen
  spotifyUrl
  temporada
  capitulo
  body
}
    `;
export const HistoriasDocument = gql`
    query historias($relativePath: String!) {
  historias(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HistoriasParts
  }
}
    ${HistoriasPartsFragmentDoc}`;
export const HistoriasConnectionDocument = gql`
    query historiasConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HistoriasFilter) {
  historiasConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HistoriasParts
      }
    }
  }
}
    ${HistoriasPartsFragmentDoc}`;
export const ConflictosDocument = gql`
    query conflictos($relativePath: String!) {
  conflictos(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConflictosParts
  }
}
    ${ConflictosPartsFragmentDoc}`;
export const ConflictosConnectionDocument = gql`
    query conflictosConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConflictosFilter) {
  conflictosConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConflictosParts
      }
    }
  }
}
    ${ConflictosPartsFragmentDoc}`;
export const SerendipiaDocument = gql`
    query serendipia($relativePath: String!) {
  serendipia(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SerendipiaParts
  }
}
    ${SerendipiaPartsFragmentDoc}`;
export const SerendipiaConnectionDocument = gql`
    query serendipiaConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SerendipiaFilter) {
  serendipiaConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SerendipiaParts
      }
    }
  }
}
    ${SerendipiaPartsFragmentDoc}`;
export const AnalisisDocument = gql`
    query analisis($relativePath: String!) {
  analisis(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...AnalisisParts
  }
}
    ${AnalisisPartsFragmentDoc}`;
export const AnalisisConnectionDocument = gql`
    query analisisConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AnalisisFilter) {
  analisisConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...AnalisisParts
      }
    }
  }
}
    ${AnalisisPartsFragmentDoc}`;
export const MarcoDocument = gql`
    query marco($relativePath: String!) {
  marco(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...MarcoParts
  }
}
    ${MarcoPartsFragmentDoc}`;
export const MarcoConnectionDocument = gql`
    query marcoConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: MarcoFilter) {
  marcoConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...MarcoParts
      }
    }
  }
}
    ${MarcoPartsFragmentDoc}`;
export const PodcastDocument = gql`
    query podcast($relativePath: String!) {
  podcast(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PodcastParts
  }
}
    ${PodcastPartsFragmentDoc}`;
export const PodcastConnectionDocument = gql`
    query podcastConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PodcastFilter) {
  podcastConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PodcastParts
      }
    }
  }
}
    ${PodcastPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    historias(variables, options) {
      return requester(HistoriasDocument, variables, options);
    },
    historiasConnection(variables, options) {
      return requester(HistoriasConnectionDocument, variables, options);
    },
    conflictos(variables, options) {
      return requester(ConflictosDocument, variables, options);
    },
    conflictosConnection(variables, options) {
      return requester(ConflictosConnectionDocument, variables, options);
    },
    serendipia(variables, options) {
      return requester(SerendipiaDocument, variables, options);
    },
    serendipiaConnection(variables, options) {
      return requester(SerendipiaConnectionDocument, variables, options);
    },
    analisis(variables, options) {
      return requester(AnalisisDocument, variables, options);
    },
    analisisConnection(variables, options) {
      return requester(AnalisisConnectionDocument, variables, options);
    },
    marco(variables, options) {
      return requester(MarcoDocument, variables, options);
    },
    marcoConnection(variables, options) {
      return requester(MarcoConnectionDocument, variables, options);
    },
    podcast(variables, options) {
      return requester(PodcastDocument, variables, options);
    },
    podcastConnection(variables, options) {
      return requester(PodcastConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
