/**
 * Created by Administrator on 2016/9/19.
 */
export const api=[
    {
        "key": "验证accessToken的正确性",
        "url": "/accesstoken",
        "receive":{"accesstoken ":""},
        "method": "post"
    },
    {
        "key": "获取主题类型列表",
        "url": "/topics",
        "receive":{"page":1,"limit":20,"tab":"all||ask||share||job||good"},
        "method": "get"
    },
    {
        "key": "获取主题详情",
        "url": "/topic",
        "receive":{"id":""},
        "method": "get"
    },
    {
        "key": "收藏主题",
        "url": "/topic_collect/collect",
        "receive":{"topic_id":"","accesstoken":""},
        "method": "post"
    },
    {
        "key": "取消主题",
        "url": "/topic_collect/de_collect",
        "receive":{"topic_id":"","accesstoken":""},
        "method": "post"
    },
    {
        "key": "用户所收藏的主题",
        "url": "/topic_collect",
        "receive":{"loginname":""},
        "method": "get"
    },
    {
        "key": "获取未读消息数",
        "url": "/message/count",
        "receive":{"accesstoken":""},
        "method": "get"
    },
    {
        "key": "获取已读和未读消息",
        "url": "/messages",
        "receive":{"accesstoken":""},
        "method": "get"
    },
    {
        "key": "标记全部已读",
        "url": "/message/mark_all",
        "receive":{"accesstoken":""},
        "method": "post"
    },
    {
        "key": "用户详情",
        "url": "/user",
        "receive":{"loginname":""},
        "method": "get"
    }
];