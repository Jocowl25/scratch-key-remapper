const keyChangeArray=[
    {oldkey:"i",newkey:"a"}
]
/*TO DO:
-use array to store key pairs in above format (turn into class?)
-dynamically add set of html fields that can set these pairs (splice array when erasing element)
*/
let input
const upload=document.querySelector(".upload")
const go=document.querySelector(".go")
upload.addEventListener("click",()=>{
    inputElement.click()
})
go.addEventListener("click",()=>{
    try{
        let file=new File([JSON.stringify(convert(input))],"project.json",{type: 'json'})
        const link = document.createElement('a')
        const url = URL.createObjectURL(file)
        link.href = url
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        }
    catch(error){
        alert(`Something went wrong. ${error}`)
        }
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
            alert("This isn't a JSON file! Please upload a different file.")
        }
    },
    false,
  );
}, false);

function convert(input){
    let output=JSON.parse(JSON.stringify(input))
    input.targets.forEach((target,i)=>{
        let blocks=Object.keys(target.blocks)
        blocks.forEach(block=>{
            if(target.blocks[block].opcode=="event_whenkeypressed"||target.blocks[block].opcode=="sensing_keyoptions"){
                keyChangeArray.forEach(ele=>{
                    if(target.blocks[block].fields.KEY_OPTION[0]==ele.oldkey){
                        output.targets[i].blocks[block].fields.KEY_OPTION[0]=ele.newkey
                    }
                })
            
            }
        })
    })
  return output
}