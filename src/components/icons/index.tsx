import { Props } from "../../types";

export function IconDelete() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1 0H15C15.6 0 16 0.4 16 1V15C16 15.6 15.6 16 15 16H1C0.4 16 0 15.6 0 15V1C0 0.4 0.4 0 1 0ZM10.1 11.5L11.5 10.1L9.4 8L11.5 5.9L10.1 4.5L8 6.6L5.9 4.5L4.5 5.9L6.6 8L4.5 10.1L5.9 11.5L8 9.4L10.1 11.5Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function IconArrow(props?: Props) {
    return (
        <svg
            {...props}
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.573289 8.3041C0.485753 8.4401 0.476037 8.61663 0.548054 8.76263C0.620071 8.90862 0.76197 9.00006 0.916628 9.00012H10.0834C10.2382 8.99982 10.38 8.90809 10.4518 8.76189C10.4836 8.69846 10.5002 8.62761 10.5001 8.55566C10.5001 8.46583 10.4745 8.37812 10.4268 8.3041L5.84338 1.19276C5.76564 1.07217 5.63724 1.00012 5.50004 1.00012C5.36284 1.00012 5.23443 1.07217 5.1567 1.19276L0.573289 8.3041Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function IconFolder(props?: Props) {
    return (
        <svg
            {...props}
            width="23"
            height="23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22.7 10.578c-.289-.29-.72-.578-1.152-.578H5.715c-.575 0-1.151.289-1.295.867L.102 20.977C-.186 21.845.102 23 1.397 23H17.23c.575 0 1.151-.289 1.295-.867l4.318-10.11c.288-.434.144-1.012-.144-1.445z"
                fill="currentColor"
            />
            <path
                d="M1.754 9.814c.73-1.587 2.338-2.598 4.092-2.598H19V4.33c0-.866-.585-1.443-1.462-1.443H9.354L6.869.433C6.577.144 6.285 0 5.846 0H1.462C.585 0 0 .577 0 1.443V14l1.754-4.186z"
                fill="currentColor"
            />
        </svg>
    );
}

export function IconLoader({ size = 20 }: { size: number }) {
    return <div class="fm-loader" style={{ "--size": `${size}px` }} />;
}
