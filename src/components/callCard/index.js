import React, { useEffect, useRef } from "react";

export default function CallCard(props) {
    const videoEl = useRef(null);
    const audioEl = useRef(null);

    /**
     * When video track changes, update video srcObject
     */
    useEffect(() => {
        videoEl.current &&
            (videoEl.current.srcObject = new MediaStream([props.videoTrack]));
    }, [props.videoTrack]);

    /**
     * When audio track changes, update audio srcObject
     */
    useEffect(() => {
        audioEl.current &&
            (audioEl.current.srcObject = new MediaStream([props.audioTrack]));
    }, [props.audioTrack]);

    function getLoadingComponent() {
        return props.isLoading && <p className="loading">Loading...</p>;
    }

    function getVideoComponent() {
        return (
            props.videoTrack && <video className="call-card-video" autoPlay muted playsInline ref={videoEl} />
        );
    }

    function getAudioComponent() {
        return (
            !props.isLocalPerson &&
            props.audioTrack && <audio autoPlay playsInline ref={audioEl} />
        );
    }

    function getClassNames() {
        let classNames = "call-card-wrapper";
        props.isLocalPerson && (classNames += " local");
        return classNames;
    }

    return (
        <div className={getClassNames()}>
            <div className="background" />
            {getLoadingComponent()}
            {getVideoComponent()}
            {getAudioComponent()}
        </div>
    );
}