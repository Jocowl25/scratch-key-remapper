const change="c"//FIX LATER
let input
let upload=document.querySelector(".upload")
let go=document.querySelector(".go")
upload.addEventListener("click",()=>{
    inputElement.click()
})
go.addEventListener("click",()=>{
        try{
            let output=convert(input)
            let file=new File([JSON.stringify(output)],"project.json",{type: 'json'})
        }
            catch(error){
                alert("Something went wrong :(")
            }
 const link = document.createElement('a')
  const url = URL.createObjectURL(file)
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
})
const inputElement = document.getElementById("input");
inputElement.addEventListener("change", (e)=>{
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load",() => {
        try{
            input= JSON.parse(reader.result);
            go.style.display="block"
        }catch(error){
            alert("This isn't a JSON file! Plase upload a different file.")
        }
    },
    false,
  );
}, false);

function convert(input){
    input.targets.forEach((target)=>{
        let keys=Object.keys(target.blocks)
        keys.forEach(key=>{
            if(target.blocks[key].opcode=="event_whenkeypressed"||target.blocks[key].opcode=="sensing_keyoptions"){
                target.blocks[key].fields.KEY_OPTION[0]=change //FIX LATER
            }
        })
    })
  return input
}