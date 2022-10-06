import shortId from "shortid";

export const newMember = (user) => ({
    id: user.id,
    name: user.first_name + " " + user.last_name,
    avatar: user.profile?.avatar_url
})

function hashCode(string) {
  return string;
};

export const newCard = (asset) => {
    return {
        id: asset.id,
        slug: asset.slug,
        hash: hashCode(asset.slug+asset.title+asset.status+asset.test_status+asset.sync_status+asset.status_text),
        title: asset.title,
        type: asset.asset_type,
        seo_keywords: asset.seo_keywords || [],
        url: asset.url,
        readme_url: asset.readme_url,
        status: asset.status,
        test_status: asset.test_status || 'PENDING',
        status_text: asset.status_text,
        sync_status: asset.sync_status || 'PENDING',
        members: asset.author ? [newMember(asset.author)] : [],
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        attachments: [],
        comments: []
      }
}

export const newColumn = (id, title, cards=[]) => ({
    id,
    title,
    cardList: [...cards]
})
// board => list => cardList

export const newBoard = ({ title, member_ids, columns }) => {
  return {
      id: shortId.generate(),
      title: title,
      list: [...columns],
      members: member_ids
    }
}

export const labels = {
    error: "error",
    ok: "success",
    warning: "action",
    pending: "action",
    undefined: "action",
};

export const iconTypes = {
    exercise: "directions_bike",
    lesson: "receipt",
    article: "art_track",
    project: "dvr",
    quiz: "playlist_add_check",
};