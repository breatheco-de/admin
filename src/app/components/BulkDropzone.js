import React, {useMemo,useEffect} from 'react';



const activeStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };
export function BulkDropzone(props) {
    const baseStyle = {
        flex: 1,
        fontSize: props.fontSize,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: props.padding,
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
      };
     
    //   } = useDropzone({accept:"csv/*"});

  const files = props.acceptedFiles.map(file =>
    (
      
      <li key={file.path}>
      
      {file.path} - {file.size} bytes
    </li>
  ));

  const style = useMemo(() => ({
    ...baseStyle,
    ...(props.isDragActive ? activeStyle : {}),
    ...(props.isDragAccept ? acceptStyle : {}),
    ...(props.isDragReject ? rejectStyle : {}),
  }), [
    props.isDragActive,
    props.isDragReject,
    props.isDragAccept,
  ]);
  


  
  return (
    <section className="container" >
      <div {...props.getRootProps({ style })}>
        <input {...props.getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        {/* <h4>Files</h4> */}
        <ul>{files}</ul>
      </aside>
    </section>
  );
}