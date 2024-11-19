const Song = require('../models/song.model');
const User = require('../models/user.model');
const Topic = require('../models/topic.model');

const paginationHelper = require('../../../helpers/pagination')

// Random hóa danh sách trước khi export
let randomSort = Math.random() - 0.5;

//[POST] /api/v1/songs
module.exports.index = async (req, res) => {
    let find = {
        statusSecurity: "public",
        deleted: false
    }

    //Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 9
    }
    const countSongs = await Song.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.body, countSongs)
    //End Pagination

    if (objectPagination.currentPage <= objectPagination.totalPage) {
        let songs = await Song.find(find).select("_id title idUser idTopic pathImage pathSong")
            .lean();

        songs = songs.sort(() => randomSort);

        songs = songs.slice(objectPagination.skip, objectPagination.skip + objectPagination.limitItems);


        for (const song of songs) {
            const user = await User.findOne({
                _id: song.idUser,
                deleted: false
            }).lean();

            const topic = await Topic.findOne({
                _id: song.idTopic,
                status: "active",
                deleted: false
            })

            song["userName"] = user.userName;
            song["topic"] = topic.title;
        }

        res.json({
            code: 200,
            message: "Thành công!",
            songs: songs
        })
    } else {
        res.json({
            code: 400,
            message: "Thất bại. Đã lấy hết danh sách!"
        })
    }
}

// module.exports.index = async (req, res) => {
//     let find = {
//         statusSecurity: "public",
//         deleted: false
//     }

//     if (!req.session.songListSeed) {
//         req.session.songListSeed = Date.now();
//     }

//     const sessionSeed = req.session.songListSeed;

//     // Phân trang
//     let initPagination = {
//         currentPage: 1,
//         limitItems: 9
//     }

//     const countSongs = await Song.countDocuments(find);
//     const objectPagination = paginationHelper(initPagination, req.body, countSongs)

//     if (objectPagination.currentPage <= objectPagination.totalPage) {
//         // Lấy toàn bộ ID bài hát
//         const allSongIds = await Song.find(find).select("_id").lean();

//         // Xáo trộn ngẫu nhiên các ID sử dụng seed từ session
//         const shuffledSongIds = allSongIds.sort((a, b) => {
//             // Sử dụng một thuật toán random đơn giản với seed
//             const randomValue = (seed) => {
//                 const x = Math.sin(seed++) * 10000;
//                 return x - Math.floor(x);
//             };

//             return randomValue(sessionSeed) - 0.5;
//         });

//         // Chọn các ID cho trang hiện tại
//         const pageSongIds = shuffledSongIds.slice(
//             objectPagination.skip,
//             objectPagination.skip + objectPagination.limitItems
//         );

//         // Lấy các bài hát được random
//         const songs = await Song.find({
//             _id: {
//                 $in: pageSongIds.map(song => song._id)
//             }
//         }).select("_id title idUser idTopic pathImage pathSong").lean();

//         // Thêm thông tin user và topic
//         for (const song of songs) {
//             const user = await User.findOne({
//                 _id: song.idUser,
//                 deleted: false
//             }).lean();

//             const topic = await Topic.findOne({
//                 _id: song.idTopic,
//                 status: "active",
//                 deleted: false
//             }).lean();

//             song["userName"] = user.userName;
//             song["topic"] = topic.title;
//         }

//         res.json({
//             code: 200,
//             message: "Thành công!",
//             songs: songs
//         })
//     } else {
//         res.json({
//             code: 400,
//             message: "Thất bại. Đã lấy hết danh sách!"
//         })
//     }
// }