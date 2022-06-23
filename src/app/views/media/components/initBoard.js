import shortId from "shortid";

export const newMember = (user) => ({
    id: user.id,
    name: user.first_name + " " + user.last_name,
    avatar: user.profile?.avatar_url
})

export const newCard = (asset) => {
    return {
        id: asset.slug,
        title: asset.title,
        type: asset.asset_type,
        members: asset.author ? [newMember(asset.author)] : [],
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        attachments: [
          {
            name: "sky-life.jpg",
            size: "1.2 MB",
            url: "/assets/images/sq-11.jpg"
          }
        ],
        comments: [
          {
            id: shortId.generate(),
            uid: "7863a6802ez0e277a0f98534",
            text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
            time: new Date()
          }
        ]
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
    lesson: {
      title: "Lesson",
      color: "error"
    },
    article: {
      title: "Article",
      color: "green"
    },
    project: {
      title: "Project",
      color: "secondary"
    },
    exercise: {
      title: "Exercise",
      color: "primary"
    }
};