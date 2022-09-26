var socket = io();
var button = document.getElementById('reciever-joining-room');
let file = document.getElementById('file-input');
let sender_id;

button.addEventListener('click', () => {
    sender_id = document.querySelector('#join-id').value;
    var RoomId = Math.floor(Math.random() * 100)*1234;
    socket.emit('reciever-join', {
        uid: RoomId,
        sender_uid: sender_id
    });
    document.querySelector('.join-screen').classList.remove('active');
    document.querySelector('.fs-screen').classList.add('active');
});


let fileShare = {}


file.addEventListener('change', (e) => { 
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = function(e){
        let buffer = new Uint8Array(reader.result);
        shareFile({filename: file.name} , buffer)
    }
    reader.readAsArrayBuffer(file)
})

function shareFile(metadata, buffer){
    socket.emit('file-meta', {
            uid: sender_id,
            metadata: metadata
    })

socket.on('sendFile', () => {
        let chunk = buffer.slice(0, buffer.byteLength+1);
        buffer = buffer.slice(buffer.byteLength+1, buffer.length);
        if (chunk.byteLength){
        socket.emit('file-raw', {
            uid: sender_id,
            buffer: chunk
        })  
        }
    })
}

socket.on('fs-meta', (metadata) => {
    fileShare.metadata = metadata;
    fileShare.buffer = [];
    socket.emit('fs-start',{
        uid: sender_id
    })
})

socket.on('acceptFile', (buffer) => {
     if(buffer.byteLength){
        blob = new Blob([buffer], {type: typeof(buffer)})
        download(blob, fileShare.metadata.filename)
        fileShare = {}
    } else {
        socket.emit('fs-start', {
            uid: sender_id,
        })
    }
})
