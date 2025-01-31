import { FormEvent, FormEventHandler, useEffect } from "react"

export default function CreateSeriesDialogue({ active, setActive }: { active: boolean, setActive: any }) {

    useEffect(() => {
        console.log("hi")
    }, []);

    function submitForm(f: FormEvent<HTMLFormElement>) {
        f.preventDefault();
    }

    return (
        <div className="">
            {active == true &&
                <div style={{width: 400}} className="centerDialogue">
                    <form onSubmit={submitForm}>
                        <div className="mv2">
                            <h2 className="textCenter">Create Series</h2>
                            <div className="column">
                                <label>Name</label>
                                <input placeholder="Series title"/>
                            </div>
                            <div className="column">
                                <label>Description</label>
                                <textarea placeholder="A short description about this series"/>
                            </div>
                        </div>
                        <div className="leftRow">
                            <button style={{marginRight: 10}} type="submit">+ Series</button>
                            <button style={{marginLeft: 10}} type="button">Cancel</button>
                        </div>
                    </form>
                </div>}
        </div>
    )
}