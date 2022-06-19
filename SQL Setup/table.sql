CREATE TABLE boards(
    postPassword VARCHAR(16),
    id INT,
    title VARCHAR(17),
    contents VARCHAR(1024),
    isAdmin VARCHAR(3),
    postDate VARCHAR(10),
    author VARCHAR(20),
    views INT
);

-- 아래는 나중에 추가할 희망사항

-- CREATE TABLE boards(
--     postPassword VARCHAR(16),
--     id INT,
--     title VARCHAR(17),
--     contents VARCHAR(1024),
--     isAdmin VARCHAR(3),
--     postDate VARCHAR(10),
--     author VARCHAR(20),
--     views INT,
--     likes INT,
--     dislikes INT
-- );