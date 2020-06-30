import React, { useEffect, useReducer } from "react";
import "./call.css";
import CallCard from "../callCard";
import {
    initialCallState,
    CLICK_ALLOW_TIMEOUT,
    PARTICIPANTS_CHANGE,
    CAM_OR_MIC_ERROR,
    FATAL_ERROR,
    callReducer,
    isLocal,
} from "./callState";

export default function Call({callObject}) {
    const [callState, dispatch] = useReducer(callReducer, initialCallState);

    /**
     * Start listening for participant changes, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        const events = [
            "participant-joined",
            "participant-updated",
            "participant-left"
        ];

        function handleNewParticipantsState(event) {
            dispatch({
                type: PARTICIPANTS_CHANGE,
                participants: callObject.participants()
            });
        }

        // Use initial state
        handleNewParticipantsState();

        // Listen for changes in state
        for (const event of events) {
            callObject.on(event, handleNewParticipantsState);
        }

        // Stop listening for changes in state
        return function cleanup() {
            for (const event of events) {
                callObject.off(event, handleNewParticipantsState);
            }
        };
    }, [callObject]);

    /**
     * Start listening for call errors, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        function handleCameraErrorEvent(event) {
            dispatch({
                type: CAM_OR_MIC_ERROR,
                message:
                    (event && event.errorMsg && event.errorMsg.errorMsg) || "Unknown"
            });
        }

        // We're making an assumption here: there is no camera error when callObject
        // is first assigned.

        callObject.on("camera-error", handleCameraErrorEvent);

        return function cleanup() {
            callObject.off("camera-error", handleCameraErrorEvent);
        };
    }, [callObject]);

    /**
     * Start listening for fatal errors, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        function handleErrorEvent(e) {
            dispatch({
                type: FATAL_ERROR,
                message: (e && e.errorMsg) || "Unknown"
            });
        }

        // We're making an assumption here: there is no error when callObject is
        // first assigned.

        callObject.on("error", handleErrorEvent);

        return function cleanup() {
            callObject.off("error", handleErrorEvent);
        };
    }, [callObject]);

    /**
     * Start a timer to show the "click allow" message, when the component mounts.
     */
    useEffect(() => {
        const t = setTimeout(() => {
            dispatch({ type: CLICK_ALLOW_TIMEOUT });
        }, 2500);

        return function cleanup() {
            clearTimeout(t);
        };
    }, []);

    function getCallCards() {
        let callCards = [];
        let blankCards = [];
        
        Object.entries(callState.callItems).forEach(([id, callItem]) => {
            const card = (
                <CallCard
                    key={id}
                    videoTrack={callItem.videoTrack}
                    audioTrack={callItem.audioTrack}
                    isLocalPerson={isLocal(id)}
                    isLoading={callItem.isLoading}
                />
            );
            callCards.push(card)
        });

        for (let i = callCards.length; i < 4; i++) {
            blankCards.push(
                <CallCard
                    key={i}
                    isLocalPerson={false}
                    isLoading={false}
                />
            )
        }

        return [callCards, blankCards];
    }

    const [callCards, blankCards] = getCallCards();
    return (
        <>
            {callCards}
            {blankCards}
        </>
    );
}